using SchoolAdmissionSystem.API.Data;
using SchoolAdmissionSystem.API.Models;
using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.API.Services.Interfaces;

namespace SchoolAdmissionSystem.API.Services.Implements
{
    public class HoldExpirationService : BackgroundService, IHoldExpirationService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<HoldExpirationService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromSeconds(30);

        public HoldExpirationService(IServiceProvider serviceProvider, ILogger<HoldExpirationService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Hold Expiration Service started");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await ProcessExpiredHolds();
                    await Task.Delay(_checkInterval, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error processing expired holds");
                }
            }

            _logger.LogInformation("Hold Expiration Service stopped");
        }

        private async Task ProcessExpiredHolds()
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                var expiredHolds = await context.Holds
                    .Where(h => h.Status == HoldStatus.Held)
                    .ToListAsync();

                var expiredList = expiredHolds.Where(h => h.IsExpired).ToList();

                if (expiredList.Any())
                {
                    _logger.LogInformation("Found {Count} expired holds", expiredList.Count);

                    foreach (var hold in expiredList)
                    {
                        hold.Status = HoldStatus.Expired;
                        hold.UpdatedAt = DateTime.UtcNow;
                        _logger.LogInformation("Marked hold as expired: {HoldId}", hold.Id);
                    }

                    await context.SaveChangesAsync();
                    _logger.LogInformation("Processed {Count} expired holds", expiredList.Count);
                }
            }
        }
    }
}
