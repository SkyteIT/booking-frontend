// src/pages/Vendor/Support/VendorSupport.tsx
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import SearchIcon from "@mui/icons-material/Search";
import TipsAndUpdatesOutlinedIcon from "@mui/icons-material/TipsAndUpdatesOutlined";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { isAxiosError } from "axios";
import { useMemo, useRef, useState } from "react";
import { submitSupportTicket } from "../../../services/Vendor/supportService";

const SUPPORT_EMAIL = "ube.bookingsystem23@gmail.com";

type QuickLink = {
  key: string;
  icon: typeof RocketLaunchOutlinedIcon;
  title: string;
  subtitle: string;
  content: React.ReactNode;
};

const QUICK_LINKS: QuickLink[] = [
  {
    key: "getting-started",
    icon: RocketLaunchOutlinedIcon,
    title: "Getting Started Guide",
    subtitle: "Learn the basics",
    content: (
      <Stack spacing={1.5}>
        <Typography>
          1. <strong>Create a listing</strong> from Listings → Add New Listing. The wizard walks
          through Basic Info, Category Details, Bookable Units, Images, and a final Review step.
        </Typography>
        <Typography>
          2. <strong>Set up bookable units</strong> — a list of named units, a seat grid, or time
          slots, depending on what you're offering.
        </Typography>
        <Typography>
          3. <strong>Configure pricing</strong> in Pricing & Promotions — seasonal date-range
          rates and optional customer-facing offers.
        </Typography>
        <Typography>
          4. <strong>Turn on notifications</strong> in Settings so you hear about new bookings,
          reviews, and payouts as they happen.
        </Typography>
      </Stack>
    ),
  },
  {
    key: "vendor-terms",
    icon: DescriptionOutlinedIcon,
    title: "Vendor Terms Summary",
    subtitle: "Commission and payout terms",
    content: (
      <Stack spacing={1.5}>
        <Typography>
          Each booking category has its own commission rate, applied automatically at checkout.
          Your net payout is the booking total minus that commission and any platform fee.
        </Typography>
        <Typography>
          If you collect payment directly (pay-at-venue categories), you'll receive a commission
          invoice instead — unpaid invoices past their due date suspend your account until settled.
        </Typography>
        <Typography>
          Refunds follow your category's cancellation policy tiers. If a refund reduces what a
          booking owed you, that's deducted from your running balance the same way.
        </Typography>
        <Typography variant="caption" color="text.secondary">
          This is a plain-language summary, not the full legal agreement.
        </Typography>
      </Stack>
    ),
  },
  {
    key: "payouts-guide",
    icon: AccountBalanceWalletOutlinedIcon,
    title: "Payouts & Ledger",
    subtitle: "How you get paid",
    content: (
      <Stack spacing={1.5}>
        <Typography>
          Every booking writes entries to your ledger — charges, commission, refunds, advances.
          Your running balance is the sum of all of it.
        </Typography>
        <Typography>
          Payouts are grouped into periodic batches and settled by the platform; you'll get a
          notification the moment one is processed. You can request an early advance against an
          already-captured payment for eligible categories.
        </Typography>
        <Typography>
          The full ledger and payout history are in Earnings, with CSV export for your records.
        </Typography>
      </Stack>
    ),
  },
  {
    key: "best-practices",
    icon: TipsAndUpdatesOutlinedIcon,
    title: "Best Practices",
    subtitle: "Optimize your listings",
    content: (
      <Stack spacing={1.5}>
        <Typography>• Keep availability and blocked dates current — stale calendars lose bookings.</Typography>
        <Typography>• Add real photos; listings with images convert noticeably better.</Typography>
        <Typography>• Reply to reviews, good and bad — a response shows up publicly next to the review.</Typography>
        <Typography>• Run a seasonal rate or an offer around slow periods instead of a flat discount.</Typography>
        <Typography>• Enable push notifications so a new booking request doesn't sit unanswered.</Typography>
      </Stack>
    ),
  },
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "How do I add a new listing?",
    answer:
      "Go to Listings → Add New Listing and follow the 5-step wizard: Basic Info, Category Details, Bookable Units, Images, and Review before publishing.",
  },
  {
    question: "When will I receive my payout?",
    answer:
      "Payouts are grouped into periodic batches and settled by the platform, not on a fixed daily schedule. You'll get a notification the moment a payout is processed — check Earnings for the full history.",
  },
  {
    question: "How do refunds affect my balance?",
    answer:
      "Refunds follow the cancellation policy set on the listing's category. Small in-policy refunds can auto-approve; larger ones need admin approval. Either way, you're notified when a refund is actually processed, and your ledger reflects the adjustment.",
  },
  {
    question: "What happens if my invoice is overdue?",
    answer:
      "For pay-at-venue bookings, unpaid commission invoices past their due date suspend your account until settled. You'll get a notification the moment that happens — pay promptly to restore visibility.",
  },
  {
    question: "How do I get notified about bookings and reviews?",
    answer:
      "Go to Settings → Notifications and turn on Email, Push, or SMS per event type. For Push specifically, also click \"Enable\" on the banner at the top — that's a one-time per-device browser permission.",
  },
  {
    question: "Can I run seasonal pricing or a promotion?",
    answer:
      "Yes — Pricing & Promotions lets you set date-range seasonal rates and create customer-facing offers (a discount, a perk, or both) with their own booking window.",
  },
];

const getApiErrorMessage = (error: unknown): string => {
  if (!isAxiosError(error)) return "Something went wrong. Please try again.";
  const data = error.response?.data;
  if (typeof data === "string") return data;
  if (data && typeof data === "object") {
    return (data as { message?: string }).message ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
};

export default function VendorSupport() {
  const [search, setSearch] = useState("");
  const [openLink, setOpenLink] = useState<QuickLink | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const ticketFormRef = useRef<HTMLDivElement>(null);

  const query = search.trim().toLowerCase();

  const filteredFaq = useMemo(
    () =>
      query
        ? FAQ_ITEMS.filter(
            (f) => f.question.toLowerCase().includes(query) || f.answer.toLowerCase().includes(query)
          )
        : FAQ_ITEMS,
    [query]
  );

  const filteredLinks = useMemo(
    () =>
      query
        ? QUICK_LINKS.filter(
            (l) => l.title.toLowerCase().includes(query) || l.subtitle.toLowerCase().includes(query)
          )
        : QUICK_LINKS,
    [query]
  );

  const scrollToTicketForm = () => {
    ticketFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      await submitSupportTicket({ subject: subject.trim(), message: message.trim() });
      setSubmitted(true);
      setSubject("");
      setMessage("");
    } catch (err) {
      setSubmitError(getApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={1} alignItems="center" textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight={700}>
          How can we help you?
        </Typography>
        <Typography color="text.secondary">Get support and find answers to common questions</Typography>
      </Stack>

      <TextField
        fullWidth
        placeholder="Search for help..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "text.secondary" }} />
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 2, mb: 4 }}>
        <ContactCard
          icon={<ChatBubbleOutlineIcon />}
          iconBg="#e3f0fb"
          iconColor="#0077B6"
          title="Message Us"
          subtitle="Live chat isn't available yet - email us and we'll respond within 24 hours."
          action="Send an email"
          onClick={() => window.location.assign(`mailto:${SUPPORT_EMAIL}`)}
        />
        <ContactCard
          icon={<EmailOutlinedIcon />}
          iconBg="#e6f4ea"
          iconColor="#2e7d32"
          title="Email Support"
          subtitle="Get help via email"
          action={SUPPORT_EMAIL}
          onClick={() => window.location.assign(`mailto:${SUPPORT_EMAIL}`)}
        />
        <ContactCard
          icon={<ConfirmationNumberOutlinedIcon />}
          iconBg="#fff3e0"
          iconColor="#e65100"
          title="Submit a Ticket"
          subtitle="Send details straight to our team"
          action="Open the form"
          onClick={scrollToTicketForm}
        />
      </Box>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Quick Links
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5 }}>
            {filteredLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Box
                  key={link.key}
                  onClick={() => setOpenLink(link)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": { borderColor: "#0077B6", bgcolor: alpha("#0077B6", 0.04) },
                  }}
                >
                  <Icon sx={{ color: "#0077B6" }} />
                  <Box>
                    <Typography fontWeight={600} fontSize={14}>
                      {link.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {link.subtitle}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
            {filteredLinks.length === 0 && (
              <Typography color="text.secondary" fontSize={14} sx={{ gridColumn: "1 / -1" }}>
                No quick links match "{search}".
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>
            Frequently Asked Questions
          </Typography>
          <Stack spacing={1}>
            {filteredFaq.map((faq) => (
              <Accordion key={faq.question} disableGutters elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px !important", "&:before": { display: "none" } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600} fontSize={14}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary" fontSize={14}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
            {filteredFaq.length === 0 && (
              <Typography color="text.secondary" fontSize={14}>
                No FAQ matches "{search}". Try a different search or submit a ticket below.
              </Typography>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Card
        ref={ticketFormRef}
        sx={{
          borderRadius: 3,
          bgcolor: alpha("#0077B6", 0.06),
          border: "1px solid",
          borderColor: alpha("#0077B6", 0.2),
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2} alignItems="center" textAlign="center" mb={3}>
            <Typography variant="h6" fontWeight={700} color="#0077B6">
              Still need help?
            </Typography>
            <Typography color="text.secondary" fontSize={14}>
              Submit a support ticket and our team will get back to you.
            </Typography>
          </Stack>

          {submitted ? (
            <Alert severity="success" onClose={() => setSubmitted(false)}>
              Your ticket was sent — we'll get back to you by email.
            </Alert>
          ) : (
            <Stack spacing={2} maxWidth={480} mx="auto">
              <TextField
                label="Subject"
                fullWidth
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <TextField
                label="How can we help?"
                fullWidth
                multiline
                minRows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {submitError && <Alert severity="error">{submitError}</Alert>}
              <Button
                variant="contained"
                disabled={submitting || !subject.trim() || !message.trim()}
                onClick={handleSubmitTicket}
                sx={{ bgcolor: "#0077B6", "&:hover": { bgcolor: "#005A8D" }, alignSelf: "center", px: 4 }}
              >
                {submitting ? "Sending..." : "Submit a Ticket"}
              </Button>
            </Stack>
          )}
        </CardContent>
      </Card>

      <Dialog open={openLink != null} onClose={() => setOpenLink(null)} maxWidth="sm" fullWidth>
        <DialogTitle>{openLink?.title}</DialogTitle>
        <DialogContent dividers>{openLink?.content}</DialogContent>
      </Dialog>
    </Container>
  );
}

function ContactCard({
  icon,
  iconBg,
  iconColor,
  title,
  subtitle,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <Card sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
      <CardContent sx={{ textAlign: "center", py: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            bgcolor: iconBg,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 1.5,
          }}
        >
          {icon}
        </Box>
        <Typography fontWeight={700} fontSize={15} mb={0.5}>
          {title}
        </Typography>
        <Typography color="text.secondary" fontSize={13} mb={1.5}>
          {subtitle}
        </Typography>
        <Button size="small" onClick={onClick} sx={{ textTransform: "none", fontWeight: 600, color: "#0077B6" }}>
          {action}
        </Button>
      </CardContent>
    </Card>
  );
}
