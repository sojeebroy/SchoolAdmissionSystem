using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.API.Data;
using SchoolAdmissionSystem.API.DTOs.Class;
using SchoolAdmissionSystem.API.Models;
using SchoolAdmissionSystem.API.Services.Interfaces;

namespace SchoolAdmissionSystem.API.Services.Implements
{
    public class ClassService : IClassService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ClassService> _logger;

        public ClassService(ApplicationDbContext context, ILogger<ClassService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<ClassResponseDto> CreateClassAsync(CreateClassDto dto)
        {
            _logger.LogInformation("Creating new class: {ClassName}", dto.Name);

            var classEntity = new Class
            {
                Id = $"c_{Guid.NewGuid().ToString("N")[..8]}",
                Name = dto.Name,
                Section = dto.Section,
                TotalSeats = dto.TotalSeats,
                CreatedAt = DateTime.UtcNow
            };

            _context.Classes.Add(classEntity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Class created successfully: {ClassId}", classEntity.Id);

            return MapToDto(classEntity);
        }

        public async Task<IEnumerable<ClassResponseDto>> GetAllClassesAsync()
        {
            _logger.LogInformation("Fetching all classes");

            var classes = await _context.Classes
                .Include(c => c.Holds)
                .ToListAsync();

            return classes.Select(c => MapToDto(c)).ToList();
        }

        public async Task<ClassResponseDto> GetClassByIdAsync(string classId)
        {
            _logger.LogInformation("Fetching class: {ClassId}", classId);

            var classEntity = await _context.Classes
                .Include(c => c.Holds)
                .FirstOrDefaultAsync(c => c.Id == classId);

            if (classEntity == null)
            {
                _logger.LogWarning("Class not found: {ClassId}", classId);
                throw new KeyNotFoundException($"Class with ID {classId} not found");
            }

            return MapToDto(classEntity);
        }

        public async Task<ClassResponseDto> UpdateClassAsync(string classId, UpdateClassDto dto)
        {
            _logger.LogInformation("Updating class: {ClassId}", classId);

            var classEntity = await _context.Classes.FirstOrDefaultAsync(c => c.Id == classId);

            if (classEntity == null)
            {
                throw new KeyNotFoundException($"Class with ID {classId} not found");
            }

            classEntity.Name = dto.Name;
            classEntity.Section = dto.Section;
            classEntity.TotalSeats = dto.TotalSeats;

            _context.Classes.Update(classEntity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Class updated successfully: {ClassId}", classId);

            return MapToDto(classEntity);
        }

        public async Task<bool> DeleteClassAsync(string classId)
        {
            _logger.LogInformation("Deleting class: {ClassId}", classId);

            var classEntity = await _context.Classes.FirstOrDefaultAsync(c => c.Id == classId);

            if (classEntity == null)
            {
                return false;
            }

            _context.Classes.Remove(classEntity);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Class deleted successfully: {ClassId}", classId);

            return true;
        }

        private ClassResponseDto MapToDto(Class classEntity)
        {
            var confirmedHolds = classEntity.Holds?.Count(h => h.Status == HoldStatus.Confirmed) ?? 0;
            var heldHolds = classEntity.Holds?.Count(h => h.Status == HoldStatus.Held) ?? 0;
            var availableSeats = classEntity.TotalSeats - confirmedHolds - heldHolds;

            return new ClassResponseDto
            {
                Id = classEntity.Id,
                Name = classEntity.Name,
                Section = classEntity.Section,
                TotalSeats = classEntity.TotalSeats,
                ConfirmedSeats = confirmedHolds,
                AvailableSeats = availableSeats,
                CreatedAt = classEntity.CreatedAt
            };
        }
    }
}
