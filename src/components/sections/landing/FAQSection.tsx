// src/components/sections/landing/FAQSection.tsx
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import { useState } from "react";

const faqs = [
  {
    id: "faq1",
    question: "How do I create a listing on the platform?",
    answer:
      'Creating a listing is simple and free. Sign up for a business account, click "Add Listing", fill in your details including photos, pricing, and availability, then submit for review. Your listing will be live within 24 hours after approval.',
  },
  {
    id: "faq2",
    question: "Is it free to list my business?",
    answer:
      "Yes, creating a basic listing is completely free. We offer premium plans with advanced features like priority placement, analytics dashboard, and promotional tools. You only pay a small commission on confirmed bookings.",
  },
  {
    id: "faq3",
    question: "How does the booking and payment process work?",
    answer:
      "Customers browse listings and book directly through our platform. Payments are processed securely and held until the booking is confirmed. Funds are released to your account within 2-3 business days after the booking date.",
  },
  {
    id: "faq4",
    question: "Can I manage my availability and pricing?",
    answer:
      "Absolutely. Your business dashboard gives you full control over availability calendars, pricing, seasonal rates, and special offers. Changes are reflected on your listing in real time.",
  },
  {
    id: "faq5",
    question: "What happens if a customer cancels a booking?",
    answer:
      "Cancellation policies are set by you as the business owner. You can choose from flexible, moderate, or strict cancellation policies. Refunds are processed automatically based on your chosen policy.",
  },
  {
    id: "faq6",
    question: "How do I contact customer support?",
    answer:
      "Our support team is available 24/7 via live chat, email, and phone. You can reach us through the Help Center in your dashboard or by visiting our Contact page. We typically respond within 1 hour.",
  },
  {
    id: "faq7",
    question: "Is my personal and payment information secure?",
    answer:
      "Yes, we take security very seriously. All data is encrypted using industry-standard SSL technology. Payments are processed through PCI-DSS compliant payment gateways. We never store your full card details.",
  },
  {
    id: "faq8",
    question: "Can I list multiple businesses or locations?",
    answer:
      "Yes, you can manage multiple listings from a single business account. Each listing has its own availability, pricing, and analytics. There is no limit to the number of listings you can create.",
  },
];

const FAQSection = () => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  // Split FAQs into two columns
  const leftFaqs = faqs.slice(0, 4);
  const rightFaqs = faqs.slice(4);

  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "#F8FAFC",
      }}
    >
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
          <Typography
            variant="body2"
            sx={{
              color: "#2563EB",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: "0.8rem",
              mb: 1,
            }}
          >
            Got Questions?
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              mb: 1.5,
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              maxWidth: 480,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "0.95rem",
            }}
          >
            Everything you need to know about our platform. Can't find an
            answer? Feel free to contact our support team.
          </Typography>
        </Box>

        {/* FAQ Two Column Grid */}
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {leftFaqs.map((faq) => (
                <Accordion
                  key={faq.id}
                  expanded={expanded === faq.id}
                  onChange={handleChange(faq.id)}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: expanded === faq.id ? "#2563EB" : "divider",
                    borderRadius: "10px !important",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    "&:before": { display: "none" }, // removes default MUI divider
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          color:
                            expanded === faq.id ? "#2563EB" : "text.secondary",
                          transition: "color 0.2s ease",
                        }}
                      />
                    }
                    sx={{
                      px: 3,
                      py: 0.5,
                      "& .MuiAccordionSummary-content": {
                        my: 1.5,
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: expanded === faq.id ? "#2563EB" : "text.primary",
                        transition: "color 0.2s ease",
                        lineHeight: 1.5,
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 3,
                      pb: 2.5,
                      pt: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.8,
                        fontSize: "0.9rem",
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {rightFaqs.map((faq) => (
                <Accordion
                  key={faq.id}
                  expanded={expanded === faq.id}
                  onChange={handleChange(faq.id)}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: expanded === faq.id ? "#2563EB" : "divider",
                    borderRadius: "10px !important",
                    overflow: "hidden",
                    backgroundColor: "#ffffff",
                    "&:before": { display: "none" },
                    transition: "border-color 0.2s ease",
                  }}
                >
                  <AccordionSummary
                    expandIcon={
                      <ExpandMoreIcon
                        sx={{
                          color:
                            expanded === faq.id ? "#2563EB" : "text.secondary",
                          transition: "color 0.2s ease",
                        }}
                      />
                    }
                    sx={{
                      px: 3,
                      py: 0.5,
                      "& .MuiAccordionSummary-content": {
                        my: 1.5,
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        color: expanded === faq.id ? "#2563EB" : "text.primary",
                        transition: "color 0.2s ease",
                        lineHeight: 1.5,
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      px: 3,
                      pb: 2.5,
                      pt: 0,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.secondary",
                        lineHeight: 1.8,
                        fontSize: "0.9rem",
                      }}
                    >
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default FAQSection;
