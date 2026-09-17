using anglenet;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddDbContext<AppDbContext>(options => {
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

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

app.Run();