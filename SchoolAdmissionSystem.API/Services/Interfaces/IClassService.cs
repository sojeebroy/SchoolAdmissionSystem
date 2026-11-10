using SchoolAdmissionSystem.API.DTOs.Class;

namespace SchoolAdmissionSystem.API.Services.Interfaces
{
    public interface IClassService
    {
        Task<ClassResponseDto> CreateClassAsync(CreateClassDto dto);
        Task<IEnumerable<ClassResponseDto>> GetAllClassesAsync();
        Task<ClassResponseDto> GetClassByIdAsync(string classId);
        Task<ClassResponseDto> UpdateClassAsync(string classId, UpdateClassDto dto);
        Task<bool> DeleteClassAsync(string classId);
    }
}
