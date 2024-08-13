from selenium_driverless import webdriver
import asyncio
import sys

async def main():

    options = webdriver.ChromeOptions()

    async with webdriver.Chrome(options=options) as driver:

        if len(sys.argv) < 1:
            print("Error: No input arguments provided.")
        await driver.get(sys.argv[1:][0])
        await driver.sleep(7)
        sys.stdout.reconfigure(encoding='utf-8')
        if sys.argv[1:][1].lower() == "true":
            print(await driver.page_source)
        
        


asyncio.run(main())
