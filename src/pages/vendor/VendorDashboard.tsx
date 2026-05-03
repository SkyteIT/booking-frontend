import { useState, useEffect } from "react";
import { Container, Typography, Grid, Card, CardContent, CircularProgress, Box } from "@mui/material";
import { getCurrentVendor } from "../../services/Vendor/listingService";
import type { VendorDto } from "../../services/Vendor/listingService";

const VendorDashboard = () => {
    const [vendor, setVendor] = useState<VendorDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const data = await getCurrentVendor();
                setVendor(data);
            } catch (error) {
                console.error("Error fetching vendor:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVendor();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: "#1E293B" }}>
                {vendor ? `${vendor.businessName} Vendor Profile` : "Vendor Dashboard"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "#64748B" }}>
                Welcome to your command center. Manage your properties and bookings here.
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
