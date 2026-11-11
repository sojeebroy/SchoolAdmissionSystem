using Microsoft.EntityFrameworkCore;
using SchoolAdmissionSystem.API.Models;

namespace SchoolAdmissionSystem.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Class> Classes { get; set; } = null!;
        public DbSet<Hold> Holds { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Name)
                    .HasMaxLength(255)
                    .IsRequired();

                entity.Property(e => e.TotalSeats)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasMany(e => e.Holds)
                    .WithOne(h => h.Class)
                    .HasForeignKey(h => h.ClassId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.Name);
            });

            modelBuilder.Entity<Hold>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.Property(e => e.Id)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.StudentId)
                    .HasMaxLength(20) 
                    .IsRequired();

                entity.Property(e => e.ClassId)
                    .HasMaxLength(50)
                    .IsRequired();

                entity.Property(e => e.Status)
                    .HasConversion<string>() 
                    .HasMaxLength(20)
                    .IsRequired();

                entity.Property(e => e.ExpiresAt)
                    .IsRequired();

                entity.Property(e => e.CreatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.Property(e => e.UpdatedAt)
                    .HasDefaultValueSql("CURRENT_TIMESTAMP");

                entity.HasIndex(e => e.StudentId);
                entity.HasIndex(e => e.ClassId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.ExpiresAt);
                entity.HasIndex(e => new { e.StudentId, e.ClassId, e.Status });
            });
        }
    }
}

