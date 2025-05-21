describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItems = await page.$$('product-item');

    for (let i = 0; i < prodItems.length; i++) {
      const data = await prodItems[i].getProperty('data');
      const json = await data.jsonValue();

      console.log(`Checking product item ${i + 1}:`, json);

      if (!json.title || !json.price || !json.image) {
        allArePopulated = false;
        break;
      }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

    /**
    **** TODO - STEP 1 ****
    * Right now this function is only checking the first <product-item> it found, make it so that
      it checks every <product-item> it found
    * Remove the .skip from this it once you are finished writing this test.
    */
  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
  console.log('Checking the "Add to Cart" button...');

  // Query the first <product-item>
  const prodItem = await page.$('product-item');

  // Get the shadowRoot of that product item
  const shadowRoot = await prodItem.getProperty('shadowRoot');

  // From shadowRoot, query the button
  const button = await shadowRoot.$('button');

  // Click the button
  await button.click();

  // Get the innerText of the button after clicking
  const buttonText = await (await button.getProperty('innerText')).jsonValue();

  // Expect it to now say "Remove from Cart"
  expect(buttonText).toBe("Remove from Cart");
}, 2500);
  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
  console.log('Checking number of items in cart on screen...');

  // Get all <product-item> elements
  const prodItems = await page.$$('product-item');

  for (let i = 0; i < prodItems.length; i++) {
    // Access shadowRoot
    const shadowRoot = await prodItems[i].getProperty('shadowRoot');

    // Query the button in the shadowRoot
    const button = await shadowRoot.$('button');

    // Click the button to add to cart
    await button.click();
  }

  // After adding all items, check the cart count
  const cartCountHandle = await page.$('#cart-count');
  const cartCount = await (await cartCountHandle.getProperty('innerText')).jsonValue();

  // Assert that the cart count is 20
  expect(cartCount).toBe("20");
}, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
  console.log('Checking number of items in cart on screen after reload...');

  // Reload the page
  await page.reload();

  // Get all <product-item> elements
  const prodItems = await page.$$('product-item');
  let allButtonsCorrect = true;

  for (let i = 0; i < prodItems.length; i++) {
    const shadowRoot = await prodItems[i].getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    const buttonText = await (await button.getProperty('innerText')).jsonValue();

    if (buttonText !== "Remove from Cart") {
      allButtonsCorrect = false;
      break;
    }
  }

  // Get cart count text
  const cartCountHandle = await page.$('#cart-count');
  const cartCount = await (await cartCountHandle.getProperty('innerText')).jsonValue();

  // Assert all buttons say "Remove from Cart" and cart count is 20
  expect(allButtonsCorrect).toBe(true);
  expect(cartCount).toBe("20");
}, 10000);
  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {
  console.log('Checking localStorage cart contents...');

  const cart = await page.evaluate(() => {
    return localStorage.getItem('cart');
  });

  // Expect cart to be a string of array with IDs 1–20
  expect(cart).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');
});

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
 it('Checking number of items in cart on screen after removing from cart', async () => {
  console.log('Removing all items from cart...');

  const prodItems = await page.$$('product-item');

  for (let i = 0; i < prodItems.length; i++) {
    const shadowRoot = await prodItems[i].getProperty('shadowRoot');
    const button = await shadowRoot.$('button');

    // Click only if button says "Remove from Cart"
    const buttonText = await (await button.getProperty('innerText')).jsonValue();
    if (buttonText === "Remove from Cart") {
      await button.click();
    }
  }

  // Check if cart count is 0
  const cartCountHandle = await page.$('#cart-count');
  const cartCount = await (await cartCountHandle.getProperty('innerText')).jsonValue();

  expect(cartCount).toBe("0");
}, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
  console.log('Checking number of items in cart after reload (should be 0)...');

  // Reload the page
  await page.reload();

  const prodItems = await page.$$('product-item');
  let allButtonsCorrect = true;

  for (let i = 0; i < prodItems.length; i++) {
    const shadowRoot = await prodItems[i].getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    const buttonText = await (await button.getProperty('innerText')).jsonValue();

    if (buttonText !== "Add to Cart") {
      allButtonsCorrect = false;
      break;
    }
  }

  const cartCountHandle = await page.$('#cart-count');
  const cartCount = await (await cartCountHandle.getProperty('innerText')).jsonValue();

  expect(allButtonsCorrect).toBe(true);
  expect(cartCount).toBe("0");
}, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
 it('Checking the localStorage to make sure cart is correct', async () => {
  console.log('Checking localStorage after emptying cart...');

  const cart = await page.evaluate(() => {
    return localStorage.getItem('cart');
  });

  expect(cart).toBe('[]');
});
  // Final pause so browser doesn't close immediately
it('Pause for inspection (not a real test)', async () => {
  console.log('Pausing for 10 seconds...');
  await page.waitForTimeout(10000); // Keeps browser open for 10 seconds
});
