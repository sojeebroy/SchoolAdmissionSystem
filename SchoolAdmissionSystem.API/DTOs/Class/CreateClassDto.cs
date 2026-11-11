namespace SchoolAdmissionSystem.API.DTOs.Class
{
    public class CreateClassDto
    {
        public string Name { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
    }
}
