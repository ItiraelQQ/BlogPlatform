﻿using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BlogPlatformAPI.Migrations
{
    /// <inheritdoc />
    public partial class ViewsPost : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Views",
                table: "Posts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Views",
                table: "Posts");
        }
    }
}
