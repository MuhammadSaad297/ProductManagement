namespace ProductManagement.Application.Exceptions;

public sealed class AppValidationException : Exception
{
    public IReadOnlyCollection<string> Errors { get; }

    public AppValidationException(IEnumerable<string> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = errors.ToArray();
    }
}
