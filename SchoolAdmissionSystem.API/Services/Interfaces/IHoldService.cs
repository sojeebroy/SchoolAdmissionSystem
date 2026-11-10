using SchoolAdmissionSystem.API.DTOs.Hold;

namespace SchoolAdmissionSystem.API.Services.Interfaces
{
    public interface IHoldService
    {
        Task<HoldResponseDto> CreateHoldAsync(string classId, string studentId);
        Task<HoldResponseDto> GetHoldByIdAsync(string holdId);
        Task<IEnumerable<HoldResponseDto>> GetStudentHoldsAsync(string studentId);
        Task<HoldResponseDto> ConfirmHoldAsync(string holdId, string studentId);
        Task<bool> CancelHoldAsync(string holdId, string studentId);
    }
}
