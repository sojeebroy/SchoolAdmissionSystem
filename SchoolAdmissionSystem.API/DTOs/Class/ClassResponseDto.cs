namespace SchoolAdmissionSystem.API.DTOs.Class
{
    public class ClassResponseDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
        public int ConfirmedSeats { get; set; }
        public int AvailableSeats { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
