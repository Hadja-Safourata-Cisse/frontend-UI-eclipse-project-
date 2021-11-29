<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns:wrs="http://www.businesscode.de/schema/bcdui/wrs-1.0.0">
		<xsl:output method="xml" encoding="UTF-8" />

		<xsl:template match="wrs:Data/wrs:R/wrs:C[12]">
				<xsl:copy>
						<xsl:copy-of select="current()*0.621371" />
				</xsl:copy>
		</xsl:template>
		<!-- Matches any element node -->
		<xsl:template match="*">
				<xsl:copy>
				  <!--Matches any attribute node-->
						<xsl:copy-of select="@*" />
						<xsl:apply-templates />
				</xsl:copy>
		</xsl:template>
</xsl:stylesheet>
