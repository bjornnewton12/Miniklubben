using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minigolf.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveParFromCourseHole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Par",
                table: "CourseHoles");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Par",
                table: "CourseHoles",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
