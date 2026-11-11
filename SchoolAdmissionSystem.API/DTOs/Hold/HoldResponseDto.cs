namespace SchoolAdmissionSystem.API.DTOs.Hold
{
    public class HoldResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string ClassId { get; set; } = string.Empty;
        public string StudentId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime ExpiresAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsExpired { get; set; }
    }
}
