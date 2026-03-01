using PasswordGenerator.Services;
using PasswordGenerator.Validators;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// Регистрация сервисов генератора паролей
builder.Services.AddScoped<IPasswordAnalyzerService, PasswordAnalyzerService>();
builder.Services.AddScoped<PasswordOptionsValidator>();
builder.Services.AddScoped<IPasswordGeneratorService, PasswordGeneratorService>();

// 🔹 Добавляем CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// 🔹 Используем CORS (важно — до маршрутов)
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers(); // API: POST /api/password/generate

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();