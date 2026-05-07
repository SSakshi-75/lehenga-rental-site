import Content from "../models/content.model.js";

// @desc    Get all content for a specific page/section or all content
// @route   GET /api/content
// @access  Public
const getContent = async (req, res) => {
  try {
    const { key } = req.query;
    if (key) {
      const content = await Content.findOne({ key });
      return res.json(content);
    }
    const content = await Content.find({});
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update or create content
// @route   POST /api/content
// @access  Private/Admin
const updateContent = async (req, res) => {
  try {
    const { key, value, type } = req.body;

    let content = await Content.findOne({ key });

    if (content) {
      content.value = value;
      content.type = type || content.type;
      const updatedContent = await content.save();
      res.json(updatedContent);
    } else {
      const newContent = new Content({
        key,
        value,
        type,
      });
      const createdContent = await newContent.save();
      res.status(201).json(createdContent);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update multiple content items at once
// @route   POST /api/content/bulk
// @access  Private/Admin
const bulkUpdateContent = async (req, res) => {
  try {
    const { items } = req.body; // Array of { key, value, type }

    const results = await Promise.all(
      items.map(async (item) => {
        return await Content.findOneAndUpdate(
          { key: item.key },
          { value: item.value, type: item.type || "text" },
          { upsert: true, new: true }
        );
      })
    );

    res.json(results);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getContent, updateContent, bulkUpdateContent };
