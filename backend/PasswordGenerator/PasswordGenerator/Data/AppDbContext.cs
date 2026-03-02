using Microsoft.EntityFrameworkCore;
using PasswordGenerator.Entities;

namespace PasswordGenerator.Data
{
    public class AppDbContext :DbContext
    {
        public DbSet<User> Users { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> dbContextOptions) : base(dbContextOptions)
        {
        }
    }
}
