{pkgs}: {
  deps = [
    pkgs.postgresql_12
    pkgs.psmisc
    pkgs.lsof
  ];
}
