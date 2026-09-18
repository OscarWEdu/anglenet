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

		var seededBooks = new[]
        {
            new Book
            {
                Title = "The Hobbit",
                ImageUrl = "https://covers.openlibrary.org/b/id/14627535-M.jpg",
                PublicationDate = new DateOnly(1937, 9, 21),
                Description = "A fantasy novel following Bilbo Baggins on an unexpected adventure.",
                LastEditedById = user1.Id
            },
            new Book
            {
                Title = "Dune",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780441172719-M.jpg",
                PublicationDate = new DateOnly(1965, 8, 1),
                Description = "A science fiction novel set on the desert planet Arrakis.",
                LastEditedById = user1.Id
            },
            new Book
            {
                Title = "Pride and Prejudice",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780141439518-M.jpg",
                PublicationDate = new DateOnly(1813, 1, 28),
                Description = "Jane Austen's classic novel of manners, relationships, and social expectations.",
                LastEditedById = user2.Id
            },
            new Book
            {
                Title = "1984",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780451524935-M.jpg",
                PublicationDate = new DateOnly(1949, 6, 8),
                Description = "A dystopian novel exploring surveillance, political control, and individual freedom.",
                LastEditedById = user1.Id
            },
            new Book
            {
                Title = "To Kill a Mockingbird",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780061120084-M.jpg",
                PublicationDate = new DateOnly(1960, 7, 11),
                Description = "A coming-of-age story exploring justice, morality, and racial inequality in the American South.",
                LastEditedById = user2.Id
            },
            new Book
            {
                Title = "The Great Gatsby",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780743273565-M.jpg",
                PublicationDate = new DateOnly(1925, 4, 10),
                Description = "A novel about wealth, ambition, and lost love during the Jazz Age.",
                LastEditedById = user1.Id
            },
            new Book
            {
                Title = "Fahrenheit 451",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9781451673319-M.jpg",
                PublicationDate = new DateOnly(1953, 10, 19),
                Description = "A dystopian novel about censorship and a society where books are forbidden.",
                LastEditedById = user2.Id
            },
            new Book
            {
                Title = "The Catcher in the Rye",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780316769488-M.jpg",
                PublicationDate = new DateOnly(1951, 7, 16),
                Description = "A coming-of-age novel following Holden Caulfield through New York City.",
                LastEditedById = user1.Id
            },
            new Book
            {
                Title = "Brave New World",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780060850524-M.jpg",
                PublicationDate = new DateOnly(1932, 1, 1),
                Description = "A dystopian novel depicting a technologically controlled future society.",
                LastEditedById = user2.Id
            },
            new Book
            {
                Title = "The Picture of Dorian Gray",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780141439570-M.jpg",
                PublicationDate = new DateOnly(1890, 6, 20),
                Description = "Oscar Wilde's novel about beauty, morality, and a mysterious portrait.",
                LastEditedById = user1.Id
            },
            new Book
            {
                Title = "Frankenstein",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780141439471-M.jpg",
                PublicationDate = new DateOnly(1818, 1, 1),
                Description = "Mary Shelley's gothic novel about scientific ambition and its consequences.",
                LastEditedById = user2.Id
            },
            new Book
            {
                Title = "The Name of the Rose",
                ImageUrl = "https://covers.openlibrary.org/b/isbn/9780151446476-M.jpg",
                PublicationDate = new DateOnly(1980, 1, 1),
                Description = "A historical mystery set in an Italian monastery in the fourteenth century.",
                LastEditedById = user1.Id
            }
        };
        
        foreach (var book in seededBooks)
        {
            var exists = await db.Books.AnyAsync(b => b.Title == book.Title);

            if (!exists)
            {
                db.Books.Add(book);
            }
        }
        await db.SaveChangesAsync();

	}
}
