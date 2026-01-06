const { PackageSize } = require('../models');
const { success, error } = require('../utils/response');

/**
 * 获取包裹规格列表
 */
const getPackageSizes = async (req, res) => {
  try {
    const packageSizes = await PackageSize.findAll({
      order: [['sizeId', 'ASC']]
    });
    res.json(success(packageSizes));
  } catch (err) {
    console.error('获取包裹规格列表错误:', err);
    res.status(500).json(error('获取包裹规格列表失败', 500));
  }
};

/**
 * 创建包裹规格
 */
const createPackageSize = async (req, res) => {
  try {
    const { sizeName, description, surcharge = 0 } = req.body;
    
    if (!sizeName) {
      return res.status(400).json(error('规格名称不能为空', 400));
    }
    
    const packageSize = await PackageSize.create({
      sizeName,
      description,
      surcharge
    });
    
    res.json(success(packageSize, '创建成功'));
  } catch (err) {
    console.error('创建包裹规格错误:', err);
    res.status(500).json(error('创建包裹规格失败', 500));
  }
};

/**
 * 更新包裹规格
 */
const updatePackageSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { sizeName, description, surcharge } = req.body;
    
    const packageSize = await PackageSize.findByPk(id);
    if (!packageSize) {
      return res.status(404).json(error('包裹规格不存在', 404));
    }
    
    if (sizeName !== undefined) packageSize.sizeName = sizeName;
    if (description !== undefined) packageSize.description = description;
    if (surcharge !== undefined) packageSize.surcharge = surcharge;
    
    await packageSize.save();
    
    res.json(success(packageSize, '更新成功'));
  } catch (err) {
    console.error('更新包裹规格错误:', err);
    res.status(500).json(error('更新包裹规格失败', 500));
  }
};

/**
 * 删除包裹规格
 */
const deletePackageSize = async (req, res) => {
  try {
    const { id } = req.params;
    
    const packageSize = await PackageSize.findByPk(id);
    if (!packageSize) {
      return res.status(404).json(error('包裹规格不存在', 404));
    }
    
    await packageSize.destroy();
    
    res.json(success(null, '删除成功'));
  } catch (err) {
    console.error('删除包裹规格错误:', err);
    res.status(500).json(error('删除包裹规格失败', 500));
  }
};

module.exports = {
  getPackageSizes,
  createPackageSize,
  updatePackageSize,
  deletePackageSize
};

