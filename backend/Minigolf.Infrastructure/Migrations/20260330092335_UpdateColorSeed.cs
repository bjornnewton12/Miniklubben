using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Minigolf.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateColorSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#F81803", "Tomat" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#FE9377", "Korall" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#F7A6AD", "Rosa" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#F6B859", "Gullris" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#45AC7F", "Havsgrön" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#4B69FE", "Kungsblå" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#A855F7", "Lila" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#EAB308", "Gul" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#22C55E", "Grön" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#3B82F6", "Blå" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("55555555-5555-5555-5555-555555555555"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#F97316", "Orange" });

            migrationBuilder.UpdateData(
                table: "Colors",
                keyColumn: "Id",
                keyValue: new Guid("66666666-6666-6666-6666-666666666666"),
                columns: new[] { "HexValue", "Name" },
                values: new object[] { "#EF4444", "Röd" });
        }
    }
}
