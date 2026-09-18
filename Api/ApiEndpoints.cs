using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace anglenet;

public static class ApiEndpoints
{
	public static void MapEndpoints(WebApplication app) {
        //User
        app.MapPost("/api/auth/register", async (
            RegisterRequest request,
            AppDbContext db,
            IPasswordHasher<User> passwordHasher,
            JwtService jwtService) =>
            {
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return Results.BadRequest("Missing Field.");
                }

                if (await db.Users.AnyAsync(u => u.Username == request.Username))
                {
                    return Results.Conflict("User already exists.");
                }

                var user = new User
                {
                    Username = request.Username
                };

                user.PwHash = passwordHasher.HashPassword(user, request.Password);

                db.Users.Add(user);
                await db.SaveChangesAsync();

                var token = jwtService.CreateToken(user);

                return Results.Created($"/api/users/{user.Id}", new
                {
                    token,
                    user = new {user.Id, user.Username}
                });
            }
        );

        app.MapPost("/api/auth/login", async (
            RegisterRequest request,
            AppDbContext db,
            IPasswordHasher<User> passwordHasher,
            JwtService jwtService) =>
            {
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return Results.BadRequest("Missing Field.");
                }

                var user = await db.Users.SingleOrDefaultAsync(u => u.Username == request.Username);

                if (user is null)
                {
                    return Results.Unauthorized();
                }

                var passwordResult = passwordHasher.VerifyHashedPassword(user, user.PwHash, request.Password);

                if (passwordResult == PasswordVerificationResult.Failed)
                {
                    return Results.Unauthorized();
                }

                var token = jwtService.CreateToken(user);

                return Results.Ok(new
                {
                    token,
                    user = new {user.Id, user.Username}
                });
            }
        );

        //Books
        app.MapGet("/api/books", async (
            string? search,
            AppDbContext db) =>
        {
            var query = db.Books
                .Include(b => b.LastEditedBy)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(b => b.Title.Contains(search));
            }

            return await query
                .OrderBy(b => b.Title)
                .Select(b => new
                {
                    b.Id,
                    b.Title,
                    b.ImageUrl,
                    b.PublicationDate,
                    b.Description,
                    LastEditedBy = b.LastEditedBy.Username
                })
                .ToListAsync();
        });
        app.MapPost("/api/books", async (
            BookRequest request,
            AppDbContext db,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
            }

            var book = new Book
            {
                Title = request.Title,
                ImageUrl = request.ImageUrl,
                PublicationDate = request.PublicationDate,
                Description = request.Description,
                LastEditedById = userId
            };

            db.Books.Add(book);
            await db.SaveChangesAsync();

            return Results.Created($"/api/books/{book.Id}", new
            {
                book.Id,
                book.Title,
                book.ImageUrl,
                book.PublicationDate,
                book.Description,
                LastEditedBy = user.Identity?.Name
            });
        }).RequireAuthorization();

        app.MapPut("/api/books/{id:int}", async (
            int id,
            BookRequest request,
            AppDbContext db,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
            }

            var book = await db.Books.FindAsync(id);

            if (book is null)
            {
                return Results.NotFound();
            }

            book.Title = request.Title;
            book.ImageUrl = request.ImageUrl;
            book.PublicationDate = request.PublicationDate;
            book.Description = request.Description;
            book.LastEditedById = userId;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                book.Id,
                book.Title,
                book.ImageUrl,
                book.PublicationDate,
                book.Description,
                LastEditedBy = user.Identity?.Name
            });
        }).RequireAuthorization();

        app.MapDelete("/api/books/{id:int}", async (
            int id,
            AppDbContext db) =>
        {
            var book = await db.Books.FindAsync(id);

            if (book is null)
            {
                return Results.NotFound();
            }

            db.Books.Remove(book);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization();

        //Quotes
        app.MapGet("/api/quotes", async (
            AppDbContext db,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
            }

            var quotes = await db.Quotes
                .Where(q => q.UserId == userId)
                .OrderBy(q => q.Id)
                .Select(q => new
                {
                    q.Id,
                    q.Text,
                    q.UserId
                })
                .ToListAsync();

            return Results.Ok(quotes);
        }).RequireAuthorization();

        app.MapPost("/api/quotes", async (
            QuoteRequest request,
            AppDbContext db,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(request.Text))
            {
                return Results.BadRequest("Quote text is required.");
            }

            var quote = new Quote
            {
                Text = request.Text,
                UserId = userId
            };

            db.Quotes.Add(quote);
            await db.SaveChangesAsync();

            return Results.Created($"/api/quotes/{quote.Id}", new
            {
                quote.Id,
                quote.Text,
                quote.UserId
            });
        }).RequireAuthorization();

        app.MapPut("/api/quotes/{id:int}", async (
            int id,
            QuoteRequest request,
            AppDbContext db,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
            }

            if (string.IsNullOrWhiteSpace(request.Text))
            {
                return Results.BadRequest("Quote text is required.");
            }

            var quote = await db.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote is null)
            {
                return Results.NotFound();
            }

            quote.Text = request.Text;

            await db.SaveChangesAsync();

            return Results.Ok(new
            {
                quote.Id,
                quote.Text,
                quote.UserId
            });
        }).RequireAuthorization();

        app.MapDelete("/api/quotes/{id:int}", async (
            int id,
            AppDbContext db,
            ClaimsPrincipal user) =>
        {
            var userIdClaim = user.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!int.TryParse(userIdClaim, out var userId))
            {
                return Results.Unauthorized();
            }

            var quote = await db.Quotes
                .FirstOrDefaultAsync(q => q.Id == id && q.UserId == userId);

            if (quote is null)
            {
                return Results.NotFound();
            }

            db.Quotes.Remove(quote);
            await db.SaveChangesAsync();

            return Results.NoContent();
        }).RequireAuthorization();
    }
}
