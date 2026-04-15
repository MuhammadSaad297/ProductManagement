namespace ProductManagement.Api.Models;

public sealed class ApiErrorResponse
{
    public int StatusCode { get; init; }
    public string Message { get; init; } = string.Empty;
    public IReadOnlyCollection<string>? Errors { get; init; }
    public string? TraceId { get; init; }
}
