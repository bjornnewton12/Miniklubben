using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Minigolf.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ReplaceColors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Null out AssignedColorId on GamePlayers before deleting Colors (no cascade on that FK)
            migrationBuilder.Sql("UPDATE \"GamePlayers\" SET \"AssignedColorId\" = NULL WHERE \"AssignedColorId\" IS NOT NULL;");

            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    new Guid("11111111-1111-1111-1111-111111111111"),
                    new Guid("22222222-2222-2222-2222-222222222222"),
                    new Guid("33333333-3333-3333-3333-333333333333"),
                    new Guid("44444444-4444-4444-4444-444444444444"),
                    new Guid("55555555-5555-5555-5555-555555555555"),
                    new Guid("66666666-6666-6666-6666-666666666666")
                });

            migrationBuilder.InsertData(
                table: "Colors",
                columns: new[] { "Id", "HexValue", "Name" },
                values: new object[,]
                {
                    { new Guid("aa000000-0000-0000-0000-000000000000"), "#E71B00", "Jordgubbs\u00f6d" },
                    { new Guid("bb000000-0000-0000-0000-000000000000"), "#FF5B49", "Aperol" },
                    { new Guid("cc000000-0000-0000-0000-000000000000"), "#F5C400", "Solrosgul" },
                    { new Guid("dd000000-0000-0000-0000-000000000000"), "#39D353", "Gr\u00e4smatta" },
                    { new Guid("ee000000-0000-0000-0000-000000000000"), "#00A86B", "Skogsgr\u00f6n" },
                    { new Guid("ff000000-0000-0000-0000-000000000000"), "#00BFA5", "Lagun" },
                    { new Guid("a1000000-0000-0000-0000-000000000000"), "#00C8E0", "Laserstr\u00e5le" },
                    { new Guid("b2000000-0000-0000-0000-000000000000"), "#2196F3", "Himmelsbl\u00e5" },
                    { new Guid("c3000000-0000-0000-0000-000000000000"), "#4100F4", "Kleinbl\u00e5" },
                    { new Guid("d4000000-0000-0000-0000-000000000000"), "#B050FF", "Lupin" },
                    { new Guid("e5000000-0000-0000-0000-000000000000"), "#9C27B0", "Sp\u00e5rvagn 8" },
                    { new Guid("f6000000-0000-0000-0000-000000000000"), "#F675C2", "Rosa" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Colors",
                keyColumn: "Id",
                keyValues: new object[]
                {
                    new Guid("aa000000-0000-0000-0000-000000000000"),
                    new Guid("bb000000-0000-0000-0000-000000000000"),
                    new Guid("cc000000-0000-0000-0000-000000000000"),
                    new Guid("dd000000-0000-0000-0000-000000000000"),
                    new Guid("ee000000-0000-0000-0000-000000000000"),
                    new Guid("ff000000-0000-0000-0000-000000000000"),
                    new Guid("a1000000-0000-0000-0000-000000000000"),
                    new Guid("b2000000-0000-0000-0000-000000000000"),
                    new Guid("c3000000-0000-0000-0000-000000000000"),
                    new Guid("d4000000-0000-0000-0000-000000000000"),
                    new Guid("e5000000-0000-0000-0000-000000000000"),
                    new Guid("f6000000-0000-0000-0000-000000000000")
                });

            migrationBuilder.InsertData(
                table: "Colors",
                columns: new[] { "Id", "HexValue", "Name" },
                values: new object[,]
                {
                    { new Guid("11111111-1111-1111-1111-111111111111"), "#F81803", "Tomat" },
                    { new Guid("22222222-2222-2222-2222-222222222222"), "#FE9377", "Korall" },
                    { new Guid("33333333-3333-3333-3333-333333333333"), "#F7A6AD", "Rosa" },
                    { new Guid("44444444-4444-4444-4444-444444444444"), "#F6B859", "Gullris" },
                    { new Guid("55555555-5555-5555-5555-555555555555"), "#45AC7F", "Havsgr\u00f6n" },
                    { new Guid("66666666-6666-6666-6666-666666666666"), "#4B69FE", "Kungsbl\u00e5" }
                });
        }
    }
}
