import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DripEmailProps {
  preheader: string;
  body: string;
}

export default function DripEmail({ preheader, body }: DripEmailProps) {
  const paragraphs = body.split("\n\n").filter(Boolean);

  return (
    <Html>
      <Head />
      <Preview>{preheader}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            {paragraphs.map((paragraph, i) => {
              const trimmed = paragraph.trim();

              if (
                trimmed.startsWith("•") ||
                trimmed.startsWith("-") ||
                trimmed.startsWith("✅")
              ) {
                const items = trimmed.split("\n").filter(Boolean);
                return (
                  <Section key={i} style={{ marginBottom: "16px" }}>
                    {items.map((item, j) => (
                      <Text key={j} style={listItem}>
                        {item}
                      </Text>
                    ))}
                  </Section>
                );
              }

              if (
                trimmed.startsWith("Layer ") ||
                trimmed.startsWith("1.") ||
                trimmed.startsWith("2.") ||
                trimmed.startsWith("3.") ||
                trimmed.startsWith("4.") ||
                trimmed.startsWith("5.") ||
                trimmed.startsWith("6.")
              ) {
                const lines = trimmed.split("\n").filter(Boolean);
                return (
                  <Section key={i} style={{ marginBottom: "16px" }}>
                    {lines.map((line, j) => (
                      <Text key={j} style={bodyText}>
                        {line}
                      </Text>
                    ))}
                  </Section>
                );
              }

              return (
                <Text key={i} style={bodyText}>
                  {trimmed}
                </Text>
              );
            })}
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            The AI Growth Engine — Built by operators, for operators.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "580px",
};

const content = {
  padding: "0 24px",
};

const bodyText = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333333",
  marginBottom: "16px",
};

const listItem = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333333",
  paddingLeft: "8px",
  marginBottom: "4px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "32px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
};
