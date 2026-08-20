// src/components/navbars/StepperBar.tsx

  
  import type { SvgIconComponent } from "@mui/icons-material";
  import BusinessIcon from "@mui/icons-material/Business";
  import CategoryIcon from "@mui/icons-material/Category";
  import CheckIcon from "@mui/icons-material/Check";
  import DescriptionIcon from "@mui/icons-material/Description";
  import PersonIcon from "@mui/icons-material/Person";
import {
    Stepper,
    Step,
    StepLabel,
    Box,
    StepConnector,
    stepConnectorClasses,
  } from "@mui/material";
  import { styled } from "@mui/material/styles";

  export interface StepperStep {
    label: string;
    icon: SvgIconComponent;
  }

  interface StepperBarProps {
    activeStep: number;
    steps?: StepperStep[];
    title?: string;
  }

  const defaultSteps: StepperStep[] = [
    { label: "Business Info", icon: BusinessIcon },
    { label: "Contact", icon: PersonIcon },
    { label: "Categories", icon: CategoryIcon },
    { label: "Documents", icon: DescriptionIcon },
    { label: "Review", icon: CheckIcon },
  ];
  
  /* ----- Custom Connector ----- */
  const CustomConnector = styled(StepConnector)(() => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor: "#d1d5db",
      borderRadius: 1,
    },
    [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
      backgroundColor: "#0077b6",
    },
    [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
      backgroundColor: "#0077b6",
    },
  }));
  
  const StepperBar = ({ activeStep, steps = defaultSteps, title = "Vendor Application" }: StepperBarProps) => {
    return (
      <Box
        sx={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          padding: "24px 32px",
          boxShadow: "0 12px 32px rgba(15,27,45,0.06)",
          mb: 3,
        }}
      >
        <Box sx={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", mb: 3 }}>
          {title}
        </Box>
  
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<CustomConnector />}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
  
            return (
              <Step key={step.label}>
                <StepLabel
                  StepIconComponent={() => {
                    const isCompleted = index < activeStep;
                    const isActive = index === activeStep;
  
                    return (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isCompleted
                            ? "linear-gradient(160deg, #005a8d, #0077b6)"
                            : isActive
                            ? "rgba(0,119,182,0.12)"
                            : "#e5e7eb",
                          boxShadow: isCompleted ? "0 6px 16px rgba(0,119,182,0.32)" : "none",
                          color: isCompleted
                            ? "#ffffff"
                            : isActive
                            ? "#0077b6"
                            : "#9ca3af",
                        }}
                      >
                        {isCompleted ? <CheckIcon /> : <Icon />}
                      </Box>
                    );
                  }}
                >
                  {step.label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    );
  };
  
  export default StepperBar;