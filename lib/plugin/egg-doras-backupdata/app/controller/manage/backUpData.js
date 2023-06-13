'use strict';
const moment = require('moment');

const fs = require('fs');
const _ = require('lodash');
const child = require('child_process');
const BackUpDataController = {
  async list(ctx) {
    try {
      const payload = ctx.query;
      const backUpDataList = await ctx.service.backUpData.find(payload, {
        attributes: {
          exclude: ['path'],
        },
      });

      ctx.helper.renderSuccess(ctx, {
        data: backUpDataList,
      });
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },

  async backUpData(ctx, app) {
    const ms = moment(new Date()).format('YYYYMMDDHHmmss').toString();

    const databackforder = app.config.sqlPath.backup;
    const dataPath = databackforder + ms;
    const sqlInfo = app.config.sequelize;

    if (!_.isEmpty(sqlInfo)) {
      const { username, password, database, host, port } = sqlInfo;

      const cmdstr = `${app.config.sqlPath.bin}mysqldump -u${username} -h${host} -P${port} --databases ${database} --lock-all-tables --flush-logs -p${password} > ${dataPath}/${database}.sql`;
      if (!fs.existsSync(databackforder)) {
        fs.mkdirSync(databackforder);
      }
      if (fs.existsSync(dataPath)) {
        console.log('已经创建过备份了');
      } else {
        fs.mkdirSync(dataPath);

        try {
          child.execSync(cmdstr);
          // 操作记录入库
          const optParams = {
            logs: 'Data backup',
            path: dataPath,
            fileName: `${ms}/${database}.sql`,
          };
          await ctx.service.backUpData.create(optParams);
          ctx.helper.renderSuccess(ctx);
        } catch (error) {
          ctx.helper.renderFail(ctx, {
            message: error,
          });
        }
      }
    }
  },

  async removes(ctx) {
    try {
      const targetIds = ctx.query.ids;

      const currentItem = await ctx.service.backUpData.item({
        query: {
          id: targetIds,
        },
      });
      if (currentItem && currentItem.path) {
        await ctx.helper.deleteFolder(currentItem.path);
      } else {
        throw new Error(ctx.__('validate_error_params'));
      }

      await ctx.service.backUpData.removes(targetIds);
      ctx.helper.renderSuccess(ctx);
    } catch (err) {
      ctx.helper.renderFail(ctx, {
        message: err,
      });
    }
  },
};

module.exports = BackUpDataController;
