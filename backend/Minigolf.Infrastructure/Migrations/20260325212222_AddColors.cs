using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Minigolf.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddColors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "AssignedColorId",
                table: "GamePlayers",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Colors",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false, defaultValueSql: "gen_random_uuid()"),
                    Name = table.Column<string>(type: "text", nullable: false),
                    HexValue = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Colors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserColorRankings",
                columns: table => new
                {
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ColorId = table.Column<Guid>(type: "uuid", nullable: false),
                    Rank = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserColorRankings", x => new { x.UserId, x.ColorId });
                    table.ForeignKey(
                        name: "FK_UserColorRankings_Colors_ColorId",
                        column: x => x.ColorId,
                        principalTable: "Colors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserColorRankings_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Colors",
                columns: new[] { "Id", "HexValue", "Name" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "#A855F7", "Lila" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "#EAB308", "Gul" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "#22C55E", "Grön" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "#3B82F6", "Blå" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "#F97316", "Orange" },
                    { new Guid("66666666-6666-6666-6666-666666666666"), "#EF4444", "Röd" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_GamePlayers_AssignedColorId",
                table: "GamePlayers",
                column: "AssignedColorId");

            migrationBuilder.CreateIndex(
                name: "IX_UserColorRankings_ColorId",
                table: "UserColorRankings",
                column: "ColorId");

            migrationBuilder.AddForeignKey(
                name: "FK_GamePlayers_Colors_AssignedColorId",
                table: "GamePlayers",
                column: "AssignedColorId",
                principalTable: "Colors",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GamePlayers_Colors_AssignedColorId",
                table: "GamePlayers");

            migrationBuilder.DropTable(
                name: "UserColorRankings");

            migrationBuilder.DropTable(
                name: "Colors");

            migrationBuilder.DropIndex(
                name: "IX_GamePlayers_AssignedColorId",
                table: "GamePlayers");

            migrationBuilder.DropColumn(
                name: "AssignedColorId",
                table: "GamePlayers");
        }
    }
}
