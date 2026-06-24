import { useState, useEffect } from "react";
import { getUsers } from "../../services/userService";
import {
  Box,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Stack,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import FilterListIcon from "@mui/icons-material/FilterList";

const ROLES = [
  { value: "", label: "Todos los roles" },
  { value: "estudiante", label: "Estudiante" },
  { value: "tutor", label: "Tutor" },
  { value: "admin", label: "Administrador" },
];

const ROLE_CHIP = {
  estudiante: { bg: "#dbeafe", color: "#1e40af" },
  tutor:      { bg: "#ede9fe", color: "#6d28d9" },
  admin:      { bg: "#d1fae5", color: "#065f46" },
};

const DEFAULT_CHIP = { bg: "#f1f5f9", color: "#475569" };

function RoleBadge({ role }) {
  const style = ROLE_CHIP[role] ?? DEFAULT_CHIP;
  return (
    <Chip
      label={role}
      size="small"
      sx={{
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: 600,
        fontSize: "0.75rem",
        textTransform: "capitalize",
        border: "none",
      }}
    />
  );
}

function StatusBadge({ active }) {
  return (
    <Chip
      label={active ? "Activo" : "Inactivo"}
      size="small"
      sx={{
        backgroundColor: active ? "#d1fae5" : "#f1f5f9",
        color: active ? "#065f46" : "#94a3b8",
        fontWeight: 600,
        fontSize: "0.75rem",
        border: "none",
      }}
    />
  );
}

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUsers(roleFilter || null);
        setUsers(data);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Error al cargar los usuarios. Intenta de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [roleFilter]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f0faf8",
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        overflowX: "hidden",
      }}
    >

      {/* ── Page header ── */}
      <Box
        sx={{
          background:
            "linear-gradient(145deg, #0a2e2b 0%, #10423f 55%, #0f766e 100%)",
          pt: { xs: 6, md: 8 },
          pb: { xs: 5, md: 7 },
          position: "relative",
          overflow: "hidden",
          width: "100%",
        }}
      >
        {/* Decorative circle */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(15,118,110,0.18)",
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: "rgba(255,255,255,0.12)",
                border: "1.5px solid rgba(255,255,255,0.2)",
              }}
            >
              <GroupsIcon sx={{ fontSize: 26, color: "#fff" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.5px",
                fontSize: { xs: "1.6rem", md: "2rem" },
              }}
            >
              Usuarios registrados
            </Typography>
          </Stack>

          <Typography
            sx={{
              color: "rgba(255,255,255,0.62)",
              fontSize: "0.95rem",
              pl: "64px",
            }}
          >
            {loading
              ? "Cargando…"
              : `${users.length} usuario${users.length !== 1 ? "s" : ""} encontrado${users.length !== 1 ? "s" : ""}`}
          </Typography>
        </Container>
      </Box>

      {/* ── Content ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

        {/* Filter */}
        <Paper
          elevation={0}
          sx={{
            border: "1px solid #e2e8f0",
            borderRadius: 3,
            p: 2.5,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
            backgroundColor: "#ffffff",
          }}
        >
          <FilterListIcon sx={{ color: "#0f766e", fontSize: 22 }} />
          <Typography
            sx={{ fontWeight: 600, color: "#10423f", fontSize: "0.9rem", mr: 1 }}
          >
            Filtrar por rol:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="role-filter-label">Rol</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={roleFilter}
              label="Rol"
              onChange={(e) => setRoleFilter(e.target.value)}
              sx={{
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0f766e",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#0f766e",
                },
              }}
            >
              {ROLES.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Paper>

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 10,
              gap: 2,
            }}
          >
            <CircularProgress size={28} sx={{ color: "#0f766e" }} />
            <Typography sx={{ color: "#64748b" }}>Cargando usuarios…</Typography>
          </Box>
        )}

        {/* Error */}
        {error && !loading && (
          <Alert
            severity="error"
            sx={{
              borderRadius: 3,
              border: "1px solid #fecaca",
              backgroundColor: "#fff1f2",
            }}
          >
            {error}
          </Alert>
        )}

        {/* Empty state */}
        {!loading && !error && users.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              p: 8,
              textAlign: "center",
              backgroundColor: "#ffffff",
            }}
          >
            <GroupsIcon sx={{ fontSize: 48, color: "#cbd5e1", mb: 2 }} />
            <Typography sx={{ color: "#64748b", fontSize: "0.95rem" }}>
              No se encontraron usuarios
              {roleFilter ? ` con rol "${roleFilter}"` : ""}.
            </Typography>
          </Paper>
        )}

        {/* Table */}
        {!loading && !error && users.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #e2e8f0",
              borderRadius: 4,
              overflow: "hidden",
              backgroundColor: "#ffffff",
            }}
          >
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{ backgroundColor: "#f8fafc" }}
                  >
                    {["ID", "Nombre", "Correo", "Rol", "Estado"].map((head) => (
                      <TableCell
                        key={head}
                        sx={{
                          fontWeight: 700,
                          color: "#10423f",
                          fontSize: "0.8rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          borderBottom: "2px solid #e2e8f0",
                          py: 1.8,
                        }}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user, idx) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        backgroundColor: idx % 2 === 0 ? "#ffffff" : "#f8fafc",
                        "&:hover": {
                          backgroundColor: "#f0faf8",
                          transition: "background-color 0.15s",
                        },
                        "&:last-child td": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: "#94a3b8",
                          fontWeight: 500,
                          fontSize: "0.85rem",
                        }}
                      >
                        #{user.id}
                      </TableCell>
                      <TableCell
                        sx={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}
                      >
                        {user.nombre}
                      </TableCell>
                      <TableCell sx={{ color: "#475569", fontSize: "0.88rem" }}>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <RoleBadge role={user.role} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge active={user.is_active} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Container>
    </Box>
  );
}