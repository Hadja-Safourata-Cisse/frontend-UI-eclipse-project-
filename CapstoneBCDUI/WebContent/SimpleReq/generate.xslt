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
										<C bRef='city' />
										<C bRef='city_ascii' />
										<C bRef='lat' />
										<C bRef='lng' />
										<C bRef='country' />
										<C bRef='iso2' />
										<C bRef='iso3' />
										<C bRef='admin_name' />
										<C bRef='capital' />
										<C bRef='population' />
										<C bRef='id' />
										<C bRef='distancetocologne' />
								</Columns>
								<From>
										<BindingSet>myCities</BindingSet>
								</From>
								<f:Filter>
										<xsl:copy-of select="/*/f:Filter/f:*" /> <!-- this copies all filters from the guiStatus -->
								</f:Filter>
						</Select>
				</WrsRequest>
		</xsl:template>
</xsl:stylesheet>