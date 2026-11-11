using Microsoft.AspNetCore.Mvc;
using SchoolAdmissionSystem.API.DTOs.Hold;
using SchoolAdmissionSystem.API.Services.Interfaces;

namespace SchoolAdmissionSystem.API.Controllers
{

    [ApiController]
    [Route("api/classes/{classId}/holds")]
    [Produces("application/json")]
    public class HoldsController : ControllerBase
    {
        private readonly IHoldService _holdService;
        private readonly ILogger<HoldsController> _logger;
        private const string StudentIdHeaderKey = "X-Student-Id";
        private const int StudentIdLength = 17;

        public HoldsController(IHoldService holdService, ILogger<HoldsController> logger)
        {
            _holdService = holdService;
            _logger = logger;
        }

  
        [HttpPost]
        [ProducesResponseType(typeof(HoldResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<HoldResponseDto>> CreateHold(string classId)
        {
            try
            {
                // Validate class ID
                if (string.IsNullOrWhiteSpace(classId))
                {
                    return BadRequest(new { message = "ClassId is required" });
                }

                // Extract and validate student ID from header
                var studentId = ExtractAndValidateStudentId();
                if (studentId == null)
                {
                    return BadRequest(new
                    {
                        message = $"Invalid or missing {StudentIdHeaderKey} header. Must be {StudentIdLength} digits"
                    });
                }

                _logger.LogInformation(
                    "CreateHold request - ClassId: {ClassId}, StudentId: {StudentId}",
                    classId, studentId);

                var result = await _holdService.CreateHoldAsync(classId, studentId);

                return CreatedAtAction(
                    nameof(GetHoldById),
                    new { classId, holdId = result.Id },
                    result);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Resource not found");
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("already has"))
            {
                _logger.LogWarning(ex, "Conflict: Student already has an active hold");
                return Conflict(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in CreateHold");
                return StatusCode(500, new { message = "An unexpected error occurred while creating the hold" });
            }
        }

        [HttpGet("{holdId}")]
        [ProducesResponseType(typeof(HoldResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<HoldResponseDto>> GetHoldById(string classId, string holdId)
        {
            try
            {
                // Validate hold ID
                if (string.IsNullOrWhiteSpace(holdId))
                {
                    return BadRequest(new { message = "HoldId is required" });
                }

                _logger.LogInformation("GetHoldById request - HoldId: {HoldId}", holdId);

                var result = await _holdService.GetHoldByIdAsync(holdId);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Hold not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching hold: {HoldId}", holdId);
                return StatusCode(500, new { message = "An error occurred while retrieving the hold" });
            }
        }

        
        private string? ExtractAndValidateStudentId()
        {
            if (!Request.Headers.TryGetValue(StudentIdHeaderKey, out var headerValue))
            {
                _logger.LogWarning("Missing {HeaderKey} header", StudentIdHeaderKey);
                return null;
            }

            var studentId = headerValue.ToString();

            if (string.IsNullOrWhiteSpace(studentId) || studentId.Length != StudentIdLength)
            {
                _logger.LogWarning(
                    "Invalid {HeaderKey}: Expected {Length} digits, got {ActualLength}",
                    StudentIdHeaderKey,
                    StudentIdLength,
                    studentId.Length);
                return null;
            }

            if (!studentId.All(char.IsDigit))
            {
                _logger.LogWarning(
                    "Invalid {HeaderKey}: Must contain only digits",
                    StudentIdHeaderKey);
                return null;
            }

            return studentId;
        }
    }
}
