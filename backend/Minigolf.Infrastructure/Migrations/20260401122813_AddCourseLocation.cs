using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minigolf.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Location",
                table: "Courses",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Location",
                table: "Courses");
        }
    }
}
