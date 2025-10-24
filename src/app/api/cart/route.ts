// src/app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';

// src/api/cart/route.ts (✅ FETCH GUEST CART)
export async function GET(req: NextRequest) {
  
  const { searchParams } = new URL(req.url);
  const cartId = searchParams.get('cart_id');

  if (!cartId) {
    return NextResponse.json({ error: 'Missing cart_id' }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.BACKEND_URL}/cart/guest/?cart_id=${cartId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('🔴 guest cart fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  let body = null;

  try {
    body = await request.json(); // may fail if body is empty
  } catch (error) {
    // No body provided — that's okay for some use cases (like guest cart creation)
    body = null;
  }

  // Example response, you can change logic here
  return NextResponse.json({ message: 'Item added', item: body });
}

export async function DELETE(request: Request) {
  const body = await request.json();

  // For example: Remove item from cart
  return NextResponse.json({ message: 'Item removed', itemId: body.id });
}
export async function PUT(request: Request) {
  const body = await request.json();

  // For example: Update item quantity in cart
  return NextResponse.json({ message: 'Item updated', item: body });
}
// export async function PATCH(request: Request) {
//   const body = await request.json();
//