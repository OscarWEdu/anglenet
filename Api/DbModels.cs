namespace anglenet;

public class User
{
    public int Id { get; set; }

    public string Username { get; set; } = "";

    public string PwHash { get; set; } = "";
}

public class Book
{
	public int Id { get; set; }
	public string Title { get; set; } = "";
	public string ImageUrl { get; set; } = "";
	public DateOnly PublicationDate { get; set; }
	public string Description { get; set; } = "";

	public int LastEditedById { get; set; }
	public User LastEditedBy { get; set; } = null!;
}

public class Quote
{
    public int Id { get; set; }

    public string Text { get; set; } = "";

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
