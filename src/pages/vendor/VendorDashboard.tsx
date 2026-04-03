// src/pages/vendor/VendorDashboard.tsx
import { Container, Typography, Grid, Card, CardContent } from "@mui/material";

const VendorDashboard = () => {
    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700, color: "#1E293B" }}>
                Vendor Dashboard
            </Typography>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: "16px" }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Total Bookings</Typography>
                            <Typography variant="h4">124</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: "16px" }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Active Listings</Typography>
                            <Typography variant="h4">8</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: "16px" }}>
                        <CardContent>
                            <Typography color="text.secondary" gutterBottom>Monthly Revenue</Typography>
                            <Typography variant="h4">$12,450</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default VendorDashboard;
