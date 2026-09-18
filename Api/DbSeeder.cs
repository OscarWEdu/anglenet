using anglenet;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public static class DbSeeder
{
	public static async Task SeedAsync(IServiceProvider services)
	{
		using var scope = services.CreateScope();

		var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
		var passwordHasher = scope.ServiceProvider.GetRequiredService<IPasswordHasher<User>>();

		var user1 = await db.Users.FirstOrDefaultAsync(u => u.Username == "FantastikPraktikant");

        if (user1 is null)
        {
            user1 = new User
            {
                Username = "FantastikPraktikant"
            };

            user1.PwHash = passwordHasher.HashPassword(user1, "oscar");

            db.Users.Add(user1);
        }

        var user2 = await db.Users.FirstOrDefaultAsync(u => u.Username == "Applefritter");

        if (user2 is null)
        {
            user2 = new User
            {
                Username = "Applefritter"
            };

            user2.PwHash = passwordHasher.HashPassword(user2, "oscar");

            db.Users.Add(user2);
        }

        await db.SaveChangesAsync();

		if (!await db.Books.AnyAsync())
		{
			var books = new[]
			{
				new Book
				{
					Title = "The Hobbit",
					ImageUrl = "https://images.unsplash.com/photo-1544947950-fa07a98d237f",
					PublicationDate = new DateOnly(1937, 9, 21),
					Description = "A fantasy novel following Bilbo Baggins on an unexpected adventure.",
					LastEditedById = user1.Id
				},
				new Book
				{
					Title = "Dune",
					ImageUrl = "https://images.unsplash.com/photo-1532012197267-da84d127e765",
					PublicationDate = new DateOnly(1965, 8, 1),
					Description = "A science fiction novel set on the desert planet Arrakis.",
					LastEditedById = user1.Id
				},
				new Book
				{
					Title = "Pride and Prejudice",
					ImageUrl = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
					PublicationDate = new DateOnly(1813, 1, 28),
					Description = "Jane Austen's classic novel of manners, relationships, and social expectations.",
					LastEditedById = user2.Id
				},
				new Book
				{
					Title = "1984",
					ImageUrl = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e",
					PublicationDate = new DateOnly(1949, 6, 8),
					Description = "A dystopian novel exploring surveillance, political control, and individual freedom.",
					LastEditedById = user1.Id
				}
			};

			db.Books.AddRange(books);
			await db.SaveChangesAsync();
		}
	}
}
