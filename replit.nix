{pkgs}: {
  deps = [
    pkgs.lsof
    pkgs.postgresql_12
    pkgs.at
    pkgs.supabase-cli
  ];
}
