using SchoolAdmissionSystem.API.Data;
using SchoolAdmissionSystem.API.DTOs.Hold;
using SchoolAdmissionSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.API.Services.Interfaces;

namespace SchoolAdmissionSystem.API.Services.Implements
{
    public class HoldService : IHoldService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<HoldService> _logger;
        private readonly IConfiguration _config;

        public HoldService(ApplicationDbContext context, ILogger<HoldService> logger, IConfiguration config)
        {
            _context = context;
            _logger = logger;
            _config = config;
        }

        public async Task<HoldResponseDto> CreateHoldAsync(string classId, string studentId)
        {
            _logger.LogInformation("Creating hold for Student: {StudentId}, Class: {ClassId}", studentId, classId);

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var classEntity = await _context.Classes
                        .FromSqlRaw("SELECT * FROM \"Classes\" WHERE \"Id\" = {0} FOR UPDATE", classId)
                        .FirstOrDefaultAsync();

                    if (classEntity == null)
                    {
                        throw new KeyNotFoundException($"Class with ID {classId} not found");
                    }

                    var confirmedCount = await _context.Holds
                        .CountAsync(h => h.ClassId == classId && h.Status == HoldStatus.Confirmed);

                    if (confirmedCount >= classEntity.TotalSeats)
                    {
                        throw new InvalidOperationException("No seats available");
                    }

                    var existingHold = await _context.Holds
                        .FirstOrDefaultAsync(h => h.ClassId == classId &&
                                               h.StudentId == studentId &&
                                               h.Status == HoldStatus.Held);

                    if (existingHold != null)
                    {
                        throw new InvalidOperationException("Student already has a held hold for this class");
                    }

                    var holdDuration = int.Parse(_config["HOLD_DURATION_SECONDS"] ?? "600");
                    var hold = new Hold
                    {
                        Id = $"h_{Guid.NewGuid().ToString("N")[..8]}",
                        ClassId = classId,
                        StudentId = studentId,
                        Status = HoldStatus.Held,  
                        CreatedAt = DateTime.UtcNow,
                        ExpiresAt = DateTime.UtcNow.AddSeconds(holdDuration),
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.Holds.Add(hold);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation("Hold created successfully: {HoldId}", hold.Id);
                    return MapToDto(hold);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error creating hold for Student: {StudentId}", studentId);
                    throw;
                }
            }
        }

        public async Task<HoldResponseDto> GetHoldByIdAsync(string holdId)
        {
            _logger.LogInformation("Fetching hold: {HoldId}", holdId);

            var hold = await _context.Holds.FirstOrDefaultAsync(h => h.Id == holdId);

            if (hold == null)
            {
                throw new KeyNotFoundException($"Hold with ID {holdId} not found");
            }

            return MapToDto(hold);
        }

        public async Task<IEnumerable<HoldResponseDto>> GetStudentHoldsAsync(string studentId)
        {
            _logger.LogInformation("Fetching holds for Student: {StudentId}", studentId);

            var holds = await _context.Holds
                .Where(h => h.StudentId == studentId)
                .ToListAsync();

            return holds.Select(h => MapToDto(h)).ToList();
        }

        public async Task<HoldResponseDto> ConfirmHoldAsync(string holdId, string studentId)
        {
            _logger.LogInformation("Confirming hold: {HoldId}, Student: {StudentId}", holdId, studentId);

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var hold = await _context.Holds.FirstOrDefaultAsync(h => h.Id == holdId);

                    if (hold == null)
                    {
                        throw new KeyNotFoundException($"Hold with ID {holdId} not found");
                    }

                    if (hold.StudentId != studentId)
                    {
                        throw new UnauthorizedAccessException("You do not have permission to confirm this hold");
                    }

                    if (hold.Status != HoldStatus.Held)
                    {
                        throw new InvalidOperationException($"Hold is already {hold.Status}");
                    }

                    if (hold.IsExpired)
                    {
                        throw new InvalidOperationException("Hold has expired");
                    }

                    hold.Status = HoldStatus.Confirmed;
                    hold.UpdatedAt = DateTime.UtcNow;  

                    _context.Holds.Update(hold);
                    await _context.SaveChangesAsync();
                    await transaction.CommitAsync();

                    _logger.LogInformation("Hold confirmed successfully: {HoldId}", holdId);
                    return MapToDto(hold);
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    _logger.LogError(ex, "Error confirming hold: {HoldId}", holdId);
                    throw;
                }
            }
        }

        public async Task<bool> CancelHoldAsync(string holdId, string studentId)
        {
            _logger.LogInformation("Cancelling hold: {HoldId}, Student: {StudentId}", holdId, studentId);

            var hold = await _context.Holds.FirstOrDefaultAsync(h => h.Id == holdId);

            if (hold == null)
            {
                return false;
            }

            if (hold.StudentId != studentId)
            {
                throw new UnauthorizedAccessException("You do not have permission to cancel this hold");
            }

            hold.Status = HoldStatus.Cancelled;
            hold.UpdatedAt = DateTime.UtcNow;

            _context.Holds.Update(hold);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Hold cancelled successfully: {HoldId}", holdId);
            return true;
        }

        private HoldResponseDto MapToDto(Hold hold)
        {
            return new HoldResponseDto
            {
                Id = hold.Id,
                ClassId = hold.ClassId,
                StudentId = hold.StudentId,
                Status = hold.Status.ToString(),
                CreatedAt = hold.CreatedAt,
                ExpiresAt = hold.ExpiresAt,
                UpdatedAt = hold.UpdatedAt,  
                IsExpired = hold.IsExpired
            };
        }
    }
}
