using Microsoft.AspNetCore.Mvc;
using SchoolAdmissionSystem.API.DTOs.Hold;
using SchoolAdmissionSystem.API.Services.Interfaces;

namespace SchoolAdmissionSystem.API.Controllers
{
   
    [ApiController]
    [Route("api/holds")]
    [Produces("application/json")]
    public class AdmissionsController : ControllerBase
    {
        private readonly IHoldService _holdService;
        private readonly ILogger<AdmissionsController> _logger;
        private const string StudentIdHeaderKey = "X-Student-Id";
        private const int StudentIdLength = 17;

        public AdmissionsController(IHoldService holdService, ILogger<AdmissionsController> logger)
        {
            _holdService = holdService;
            _logger = logger;
        }
     
        [HttpGet("me")]
        [ProducesResponseType(typeof(IEnumerable<HoldResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<HoldResponseDto>>> GetStudentHolds()
        {
            try
            {
                var studentId = ExtractAndValidateStudentId();
                if (studentId == null)
                {
                    return BadRequest(new
                    {
                        message = $"Invalid or missing {StudentIdHeaderKey} header. Must be {StudentIdLength} digits"
                    });
                }

                _logger.LogInformation("GetStudentHolds request for StudentId: {StudentId}", studentId);

                var result = await _holdService.GetStudentHoldsAsync(studentId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching student holds");
                return StatusCode(500, new { message = "An error occurred while retrieving your holds" });
            }
        }

        [HttpPost("{holdId}/confirm")]
        [ProducesResponseType(typeof(HoldResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<HoldResponseDto>> ConfirmAdmission(string holdId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(holdId))
                {
                    return BadRequest(new { message = "HoldId is required" });
                }

                var studentId = ExtractAndValidateStudentId();
                if (studentId == null)
                {
                    return BadRequest(new
                    {
                        message = $"Invalid or missing {StudentIdHeaderKey} header. Must be {StudentIdLength} digits"
                    });
                }

                _logger.LogInformation(
                    "ConfirmAdmission request - HoldId: {HoldId}, StudentId: {StudentId}",
                    holdId, studentId);

                var result = await _holdService.ConfirmHoldAsync(holdId, studentId);

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Hold not found");
                return NotFound(new { message = ex.Message });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized confirmation attempt");
                return Forbid();
            }
            catch (InvalidOperationException ex) when (ex.Message.Contains("expired"))
            {
                _logger.LogWarning(ex, "Attempt to confirm expired hold");
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid hold state for confirmation");
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error confirming admission");
                return StatusCode(500, new { message = "An unexpected error occurred while confirming admission" });
            }
        }

     
        [HttpDelete("{holdId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> CancelApplication(string holdId)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(holdId))
                {
                    return BadRequest(new { message = "HoldId is required" });
                }

                var studentId = ExtractAndValidateStudentId();
                if (studentId == null)
                {
                    return BadRequest(new
                    {
                        message = $"Invalid or missing {StudentIdHeaderKey} header. Must be {StudentIdLength} digits"
                    });
                }

                _logger.LogInformation(
                    "CancelApplication request - HoldId: {HoldId}, StudentId: {StudentId}",
                    holdId, studentId);

                var result = await _holdService.CancelHoldAsync(holdId, studentId);

                if (!result)
                {
                    return NotFound(new { message = $"Hold with ID '{holdId}' not found" });
                }

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized cancellation attempt");
                return Forbid();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling application");
                return StatusCode(500, new { message = "An error occurred while cancelling the application" });
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
