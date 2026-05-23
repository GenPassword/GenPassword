using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PasswordGenerator.Data;
using PasswordGenerator.Entities;
using PasswordGenerator.Services;
using PasswordGenerator.Services.Auth;
using PasswordGenerator.Services.Password.Analysis;
using PasswordGenerator.Services.Password.Generation;
using PasswordGenerator.Services.Password.Validator;
using PasswordGenerator.Services.RateLimiting;
using PasswordGenerator.Services.Users.Registration;
using PasswordGenerator.Services.Users.SavePassword;
using PasswordGenerator.Services.Users.Settings;
using PasswordGenerator.Services.Wordlist;
using PasswordGenerator.Validators;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();

// Регистрация сервисов генератора паролей
builder.Services.AddScoped<IPasswordAnalyzerService, PasswordAnalyzerService>();
builder.Services.AddScoped<PasswordOptionsValidator>();
builder.Services.AddScoped<IPasswordGeneratorService, PasswordGeneratorService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddSingleton<IWordlistService, WordlistService>();
builder.Services.AddScoped<IPassphraseGeneratorService, PassphraseGeneratorService>();
builder.Services.AddScoped<IUserSettingsService, UserSettingsService>();
builder.Services.AddScoped<ISequentialPatternChecker, SequentialPatternChecker>();
builder.Services.AddScoped<IRepetitionPatternChecker, RepetitionPatternChecker>();
builder.Services.AddScoped<IPasswordRule, RepetitionRule>();
builder.Services.AddScoped<IPasswordRule, SequentialRule>();
builder.Services.AddScoped<IPasswordValidator, PasswordValidator>();
builder.Services.AddSingleton<IRequestRateLimiter, RequestRateLimiter>();
builder.Services.AddScoped<IUserSavedPasswordService, UserSavedPasswordService>();
builder.Services.AddScoped<IEncryptionService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    var key = builder.Configuration["ENCRYPTION_KEY"];

    return new EncryptionService(key);
});
builder.Services.AddScoped<SettingsFactory>();


// Регистрация DbContext
var connectionStr = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionStr));
// Регистрация CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
    throw new InvalidOperationException("Jwt:Key не задан в конфигурации (appsettings или переменные окружения).");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            NameClaimType = ClaimTypes.NameIdentifier
        };

        options.Events = new JwtBearerEvents
        {
            OnChallenge = context =>
            {
                context.HandleResponse();
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Response.ContentType = "application/json";

                var message = context.AuthenticateFailure switch
                {
                    SecurityTokenExpiredException => "Сессия истекла. Войдите снова.",
                    not null => context.AuthenticateFailure.Message,
                    _ => context.ErrorDescription
                        ?? "Требуется авторизация. Передайте заголовок Authorization: Bearer <token>."
                };

                return context.Response.WriteAsJsonAsync(new { message });
            }
        };
    });

builder.Services.AddAuthorization();

var useForwardedHeaders = builder.Configuration.GetValue<bool>("ReverseProxy:UseForwardedHeaders");
if (useForwardedHeaders)
{
    builder.Services.Configure<ForwardedHeadersOptions>(options =>
    {
        options.ForwardedHeaders =
            ForwardedHeaders.XForwardedFor |
            ForwardedHeaders.XForwardedProto;

        options.KnownNetworks.Clear();
        options.KnownProxies.Clear();
    });
}

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

if (useForwardedHeaders)
{
    app.UseForwardedHeaders();
}

app.UseRouting();

app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.MapControllers(); // API: POST /api/password/generate

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();