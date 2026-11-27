import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { galleryPhotos } from "@/features/catalog/gallery";

import ProductGallery from "./product-gallery";
import {
  emasAlmondDetail,
  kasturiKijangDetail,
  parfumMobilDetail,
} from "./product-detail-fixtures";

const meta = {
  title: "Catalog/Product Gallery",
  component: ProductGallery,
  argTypes: {
    photos: {
      control: "object",
      description:
        "From galleryPhotos(product) in gallery.ts: bottles, close-up, aroma.",
    },
    fallback: {
      control: "text",
      description: "Text on the cream tile when there is no photo yet.",
    },
  },
  // The gallery column of the product page: 688px on a 1280px screen, the
  // screen minus its margins on a phone. A fixed width, because the story is
  // centered and a percentage width would collapse.
  decorators: [
    (Story) => (
      <div className="w-172 max-w-[calc(100vw-2.5rem)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductGallery>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Three photos: the bottles, the close-up and the Woody ingredients (Oud has
 * no photo yet, so the second aroma's is used). Click a thumbnail to switch;
 * with a mouse, the big photo zooms in where you point. */
export const WithAromaPhoto: Story = {
  args: {
    photos: galleryPhotos(kasturiKijangDetail),
    fallback: "Parfum & Wewangian",
  },
};

/** Sweet and Fresh have no ingredient photo yet, so two photos. */
export const WithoutAromaPhoto: Story = {
  args: {
    photos: galleryPhotos(emasAlmondDetail),
    fallback: "Parfum & Wewangian",
  },
};

/** A general product with no photo yet: the cream tile, no thumbnails. */
export const NoPhoto: Story = {
  args: {
    photos: galleryPhotos(parfumMobilDetail),
    fallback: parfumMobilDetail.category?.name ?? parfumMobilDetail.name,
  },
};

/** On a phone the thumbnails sit in a row under the photo. */
export const Phone: Story = {
  args: WithAromaPhoto.args,
  globals: { viewport: { value: "mobile2" } },
};
