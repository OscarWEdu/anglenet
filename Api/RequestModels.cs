namespace anglenet;

public class RegisterRequest
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
}

public class BookRequest
{
	public string Title { get; set; } = "";
	public string ImageUrl { get; set; } = "";
	public DateOnly PublicationDate { get; set; }
	public string Description { get; set; } = "";
}
