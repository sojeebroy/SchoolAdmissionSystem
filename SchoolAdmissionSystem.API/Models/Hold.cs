namespace SchoolAdmissionSystem.API.Models
{
    public class Hold
    {
        public string Id { get; set; } = string.Empty;
        public string ClassId { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public virtual Class Class { get; set; } = null!;
        public HoldStatus Status { get; set; } = HoldStatus.Held;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool IsExpired => Status == HoldStatus.Held && DateTime.UtcNow > ExpiresAt;







    }
}
