<?xml version="1.0"?>
<xsl:stylesheet
		xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns="http://www.businesscode.de/schema/bcdui/wrs-request-1.0.0"
		xmlns:wrs="http://www.businesscode.de/schema/bcdui/wrs-1.0.0"
		version="1.0"
		xmlns:f="http://www.businesscode.de/schema/bcdui/filter-1.0.0">

		<xsl:output method="xml" version="1.0" encoding="UTF-8"
				indent="yes" />

		<xsl:template match="/">
				<WrsRequest>
						<Select>
								<Columns>
										<C bRef='originCity' />
										<C bRef='destinationCity' />
								</Columns>
								<From>
										<BindingSet>myBooking</BindingSet>
								</From>
								<f:Filter> <xsl:copy-of select="/*/f:Filter/f:*" /> </f:Filter>					
						</Select>
				</WrsRequest>
		</xsl:template>
</xsl:stylesheet>