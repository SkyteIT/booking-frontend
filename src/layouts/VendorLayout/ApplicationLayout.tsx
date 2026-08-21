import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";
import MainFooter from "../../components/footer/MainFooter";
import MainNavbar from "../../components/navbars/CustomerNavbar";
import StepperBar from "../../components/navbars/StepperBar";

interface ApplicationLayoutProps {
  children: ReactNode;
  activeStep: number;
}

const ApplicationLayout = ({
  children,
  activeStep,
}: ApplicationLayoutProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        backgroundImage:
          "radial-gradient(ellipse 90% 65% at 50% -10%, rgba(0,119,182,0.16), transparent 70%)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <MainNavbar />

      {/* CustomerNavbar floats as position:fixed - matches the pt:16
          (128px) clearance every other page under it uses. */}
      <Container maxWidth="md" sx={{ pt: 16, pb: 5 }}>
        <StepperBar activeStep={activeStep} />

        <Box sx={{ mt: 3 }}>{children}</Box>
      </Container>

      <MainFooter />
    </Box>
  );
};

export default ApplicationLayout;
