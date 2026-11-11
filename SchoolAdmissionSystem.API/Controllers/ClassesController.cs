using Microsoft.AspNetCore.Mvc;
using SchoolAdmissionSystem.API.DTOs.Class;
using SchoolAdmissionSystem.API.Services.Interfaces;

namespace SchoolAdmissionSystem.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class ClassesController : ControllerBase
    {
        private readonly IClassService _classService;
        private readonly ILogger<ClassesController> _logger;

        public ClassesController(IClassService classService, ILogger<ClassesController> logger)
        {
            _classService = classService;
            _logger = logger;
        }

    
        [HttpPost]
        [ProducesResponseType(typeof(ClassResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ClassResponseDto>> CreateClass([FromBody] CreateClassDto dto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid CreateClass request received");
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("CreateClass request received for: {ClassName}", dto.Name);

                var result = await _classService.CreateClassAsync(dto);

                return CreatedAtAction(nameof(GetClassById), new { classId = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error in CreateClass");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in CreateClass");
                return StatusCode(500, new { message = "An unexpected error occurred while creating the class" });
            }
        }

     
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<ClassResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<ClassResponseDto>>> GetAllClasses()
        {
            try
            {
                _logger.LogInformation("GetAllClasses request received");

                var result = await _classService.GetAllClassesAsync();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching all classes");
                return StatusCode(500, new { message = "An error occurred while retrieving classes" });
            }
        }

    
        [HttpGet("{classId}")]
        [ProducesResponseType(typeof(ClassResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ClassResponseDto>> GetClassById(string classId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(classId))
                {
                    return BadRequest(new { message = "ClassId is required" });
                }

                _logger.LogInformation("GetClassById request received for ClassId: {ClassId}", classId);

                var result = await _classService.GetClassByIdAsync(classId);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Class not found: {ClassId}", classId);
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching class: {ClassId}", classId);
                return StatusCode(500, new { message = "An error occurred while retrieving the class" });
            }
        }


        [HttpPut("{classId}")]
        [ProducesResponseType(typeof(ClassResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ClassResponseDto>> UpdateClass(string classId, [FromBody] UpdateClassDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(classId))
                {
                    return BadRequest(new { message = "ClassId is required" });
                }

                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid UpdateClass request for ClassId: {ClassId}", classId);
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("UpdateClass request received for ClassId: {ClassId}", classId);

                var result = await _classService.UpdateClassAsync(classId, dto);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Class not found for update: {ClassId}", classId);
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Validation error in UpdateClass for ClassId: {ClassId}", classId);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating class: {ClassId}", classId);
                return StatusCode(500, new { message = "An error occurred while updating the class" });
            }
        }


        [HttpDelete("{classId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> DeleteClass(string classId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(classId))
                {
                    return BadRequest(new { message = "ClassId is required" });
                }

                _logger.LogInformation("DeleteClass request received for ClassId: {ClassId}", classId);

                var result = await _classService.DeleteClassAsync(classId);

                if (!result)
                {
                    return NotFound(new { message = $"Class with ID '{classId}' not found" });
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting class: {ClassId}", classId);
                return StatusCode(500, new { message = "An error occurred while deleting the class" });
            }
        }
    }
}
