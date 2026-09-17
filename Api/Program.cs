using anglenet;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options =>
{
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowAngularDev");

app.MapGet("/api/tests", async (AppDbContext db) =>
{
    return await db.Tests.ToListAsync();
});

app.MapPost("/api/tests", async (Test test, AppDbContext db) =>
{
    db.Tests.Add(test);
    await db.SaveChangesAsync();

    return Results.Created($"/api/tests/{test.Id}", test);
});

app.MapPost("/api/auth/register", async (
    RegisterRequest request,
    AppDbContext db,
    IPasswordHasher<User> passwordHasher) =>
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

        user.PwHash = passwordHasher.HashPassword(
            user,
            request.Password);

        db.Users.Add(user);
        await db.SaveChangesAsync();

        return Results.Created($"/api/users/{user.Id}", new
        {
            user.Id,
            user.Username
        });
    }
);

app.Run();