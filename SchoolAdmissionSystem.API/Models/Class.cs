namespace SchoolAdmissionSystem.API.Models
{
    public class Class
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int TotalSeats { get; set; }
        public virtual ICollection<Hold> Holds { get; set; } = new List<Hold>();
        public int HeldSeats => Holds.Count(h =>h.Status == HoldStatus.Held);
        public int ConfirmedSeats => Holds.Count(h => h.Status == HoldStatus.Confirmed);    
        public int AvailableSeats => TotalSeats - HeldSeats - ConfirmedSeats;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;



    }
}
