namespace SchoolAdmissionSystem.API.DTOs.Class
{
    public class UpdateClassDto
    {
        public string Name { get; set; } = string.Empty;
        public string Section { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
    }
}
