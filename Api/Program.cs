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

ApiEndpoints.MapEndpoints(app);

app.Run();