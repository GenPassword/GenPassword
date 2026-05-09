using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PasswordGenerator.Migrations
{
    /// <inheritdoc />
    public partial class SavesPasswordCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_userSavesPasswords_Users_UserId",
                table: "userSavesPasswords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_userSavesPasswords",
                table: "userSavesPasswords");

            migrationBuilder.RenameTable(
                name: "userSavesPasswords",
                newName: "UserSavesPasswords");

            migrationBuilder.RenameIndex(
                name: "IX_userSavesPasswords_UserId",
                table: "UserSavesPasswords",
                newName: "IX_UserSavesPasswords_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserSavesPasswords",
                table: "UserSavesPasswords",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserSavesPasswords_Users_UserId",
                table: "UserSavesPasswords",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserSavesPasswords_Users_UserId",
                table: "UserSavesPasswords");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserSavesPasswords",
                table: "UserSavesPasswords");

            migrationBuilder.RenameTable(
                name: "UserSavesPasswords",
                newName: "userSavesPasswords");

            migrationBuilder.RenameIndex(
                name: "IX_UserSavesPasswords_UserId",
                table: "userSavesPasswords",
                newName: "IX_userSavesPasswords_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_userSavesPasswords",
                table: "userSavesPasswords",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_userSavesPasswords_Users_UserId",
                table: "userSavesPasswords",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
